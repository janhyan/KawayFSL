################### S3 ###################
resource "aws_s3_bucket" "this" {
  bucket = var.s3_buckets[0]

  tags = {
    Environment = "DEV"
  }
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id

  policy = jsonencode({
    "Version" : "2008-10-17",
    "Id" : "PolicyForCloudFrontPrivateContent",
    "Statement" : [
      {
        "Sid" : "2",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : "${aws_cloudfront_origin_access_identity.this.iam_arn}"
        },
        "Action" : "s3:GetObject",
        "Resource" : "${aws_s3_bucket.this.arn}/*"
      }
    ]
    }
  )
}

################### CLOUDFRONT ###################
resource "aws_cloudfront_origin_access_identity" "this" {
  comment = "Used for accessing S3 Kaway Website"
}

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name = aws_s3_bucket.this.bucket_regional_domain_name
    origin_id   = "KawayFSLOriginAccess"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "KawayFSLOriginAccess"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  price_class = "PriceClass_200"
}

################### LAMBDA ###################
resource "aws_lambda_function" "this" {
  function_name = "PredictSignLanguage"
  role          = aws_iam_role.lambda_role.arn

  runtime  = "python3.8"
  timeout  = 300
  filename = "src/prediction_lambda.zip"
  handler  = "prediction_lambda.lambda_handler"
}

resource "aws_lambda_permission" "this" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"

  depends_on = [aws_api_gateway_deployment.this]
}

################### IAM ###################
resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

data "aws_iam_policy" "this" {
  arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = data.aws_iam_policy.this.arn
}

################### API GATEWAY ###################
resource "aws_api_gateway_rest_api" "this" {
  name        = "PredictSignLanguage"
  description = "Predict Sign Language API for Lambda Function"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.this.invoke_arn

  request_templates = {
    "application/json" = <<EOF
#set($allParams = $input.params())
{
  "method" : "$context.httpMethod",
  "authcontext" : "$context.authorizer.stringkey",
  "body-json" : $input.json('$'),
  "params" : {
    #foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
    "$type" : {
      #foreach($paramName in $params.keySet())
      "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
      #if($foreach.hasNext),#end
      #end
    }
    #if($foreach.hasNext),#end
    #end
  }
}
EOF
  }
}

################### API GATEWAY ROOT RESOURCE ###################
resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_rest_api.this.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_rest_api.this.root_resource_id
  http_method             = aws_api_gateway_method.proxy_root.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.this.invoke_arn

  request_templates = {
    "application/json" = <<EOF
  #set($allParams = $input.params())
  {
    "method" : "$context.httpMethod",
    "authcontext" : "$context.authorizer.stringkey",
    "body-json" : $input.json('$'),
    "params" : {
      #foreach($type in $allParams.keySet())
      #set($params = $allParams.get($type))
      "$type" : {
        #foreach($paramName in $params.keySet())
        "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
        #end
      }
      #if($foreach.hasNext),#end
      #end
    }
  }
  EOF
  }
}

resource "aws_api_gateway_deployment" "this" {
  depends_on = [aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.this.id
  stage_name  = "stage"
}


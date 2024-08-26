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

  enabled         = true
  is_ipv6_enabled = false
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
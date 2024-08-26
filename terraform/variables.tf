variable "s3_buckets" {
  description = "List of bucket names"
  type        = list(string)
  default     = ["kawayfsl.com"]
}
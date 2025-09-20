variable "instance_name" {
  description = "value of the ec2 instance's Name tag."
  type        = string
  default     = "learn-terraform"
}

variable "instance_type" {
  description = "the ec2 instance's type."
  type        = string
  default     = "t3.micro"
}
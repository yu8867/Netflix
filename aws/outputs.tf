output "instance_hostname" {
    description = "Private des name of the ec2 instance"
    value       = aws_instance.app_server.private_dns
}
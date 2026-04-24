terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "AWS_ACCESS_KEY_ID" {}
variable "AWS_SECRET_ACCESS_KEY" {}
variable "MY_SUBDOMAIN" {}
variable "MY_TOKEN" {}

# make sure to create environment variables of "TF_VAR_AWS_ACCESS_KEY_ID" and "TF_VAR_AWS_SECRET_ACCESS_KEY"
provider "aws" {
  region = "eu-north-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

data "http" "my_public_ip" {
  url = "https://icanhazip.com"
}

locals {
  my_ip = chomp(data.http.my_public_ip.response_body)
}


resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "main"
  }
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "Main"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main"
  }
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "main"
  }
}

resource "aws_route_table_association" "main_assoc" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.main.id
}

resource "aws_security_group" "notes_sg" {
  name        = "allow_web"
  description = "Allow HTTP and SSH traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${local.my_ip}/32"] # only your IP has access to the SSH
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # everyone can see the site
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # everyone can see the site
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "notesapp_c7i" {
  ami           = "ami-01ef747f983799d6f" # 64 bit x86 Debian 13 eu-north-1
  instance_type = "c7i-flex.large"
  tags = {
    Name    = "notesapp_c7i"
    Project = "NotesApp"
  }
  key_name               = "my-terraform-key" # make sure for key file to exist in your AWS IAM, and to have the .pem file
  subnet_id              = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.notes_sg.id]
}

resource "local_file" "ansible_inventory" {
  content  = "[webserver]\n${aws_instance.notesapp_c7i.public_ip} ansible_user=admin ansible_ssh_private_key_file=~/.ssh/my-terraform-key.pem"
  filename = "ansible/inventory.ini"
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.notesapp_c7i.public_ip
}
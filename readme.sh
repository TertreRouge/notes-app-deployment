# put my-terraform-key.pem (aws ec2 ssh) in ~/.ssh with chmod 600
# create .env file containing:
# MY_SUBDOMAIN=your-duckdns-subdomain
# MY_TOKEN=your-duckdns-token
# TF_VAR_MY_SUBDOMAIN=your-duckdns-subdomain
# TF_VAR_MY_TOKEN=your-duckdns-token

# then run

export $(grep -v '^#' .env | xargs)

terraform init
terraform apply
# it will ask for your AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

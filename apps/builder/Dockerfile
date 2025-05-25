FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

RUN apt-get install git -y
RUN apt-get install -y zip

# Install AWS CLI
RUN apt-get install -y unzip
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

RUN unzip awscliv2.zip
RUN ./aws/install
# Install Docker CLI
RUN apt-get install -y apt-transport-https ca-certificates gnupg lsb-release
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
WORKDIR /home/app

COPY builder.sh builder.sh

RUN chmod +x builder.sh

COPY index.js index.js


COPY Dockerfile.js.server Dockerfile.js.server

COPY Dockerfile.ts.server Dockerfile.ts.server
    
ENTRYPOINT [ "/home/app/builder.sh" ]
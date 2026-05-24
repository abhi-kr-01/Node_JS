# #Base Image
# FROM ubuntu

# RUN apt-get update
# RUN apt install -y curl
# #to install nodejs in Image
# RUN curl -sL https://deb.nodesource.com/setup_23.x -o /tmp/nodesource_setup.sh
# RUN bash /tmp/nodesource_setup.sh
# RUN apt install -y nodejs


# #copying source code to docker Image
# COPY index.js /home/app/index.js
# COPY package-lock.json /home/app/package-lock.json
# COPY package.json /home/app/package.json

# WORKDIR /home/app

# RUN npm install 

# ENV PORT=8000
# EXPOSE 8000

# CMD ["npm","start"]

FROM node:20.17.0-alpine3.19

WORKDIR /home/app/

COPY package*.json .
RUN npm install

COPY index.js  index.js

COPY Dockerfile Dockerfile

ENV PORT=8000
EXPOSE 8000

CMD [ "npm" , "start" ]

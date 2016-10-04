FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/web
WORKDIR /usr/src/web
COPY . /usr/src/web
# Install app dependencies
RUN npm install --unsafe-perm

# Bundle app source


EXPOSE 8080


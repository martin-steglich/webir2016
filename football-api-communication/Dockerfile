FROM java:8
MAINTAINER Martin Steglich (msteglichc@gmail.com)

RUN mkdir webir

WORKDIR /webir

RUN apt-get update
RUN apt-get install -y python-pip 

# Export env settings
ENV TERM=xterm
ENV LANG en_US.UTF-8

ADD /requirements/ /tmp/requirements
RUN pip install -r /tmp/requirements/post-requirements.txt




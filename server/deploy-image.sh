#!/usr/bin/env bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 443824385971.dkr.ecr.us-east-1.amazonaws.com

docker build -t anotherpointingpokersite2 .

docker tag anotherpointingpokersite2:latest 443824385971.dkr.ecr.us-east-1.amazonaws.com/anotherpointingpokersite2:latest

docker push 443824385971.dkr.ecr.us-east-1.amazonaws.com/anotherpointingpokersite2:latest

FROM node:14
RUN mkdir -p /home/oona
WORKDIR /home/oona
COPY . .

RUN apt update -y
RUN apt install nginx -y
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build --prod
RUN cp -R dist/oona/ /var/www/html/
RUN cp docker/ssl/nginx-selfsigned.crt  /etc/ssl/certs/nginx-selfsigned.crt
RUN cp docker/ssl/nginx-selfsigned.key  /etc/ssl/private/nginx-selfsigned.key
RUN rm /etc/nginx/sites-available/default
RUN cp docker/nginx/default /etc/nginx/sites-available/
RUN service nginx start

EXPOSE 80
ENTRYPOINT service nginx start && tail -f /dev/null

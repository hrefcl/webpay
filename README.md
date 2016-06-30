# README #

Proyecto Webpay for Href Spa


Ejemplo basico
se debe configurar el archivo CGI-BIN/DATOS/TBK_CONFIG.DAT
para su correcto funcionamiento...

Webpay con transbank, basado en KCC y node.js con express 4.0, sequelize, mysql , CGI y EJS

### Para que es este repositorio ###

* Resumen Rapido
* Version 1.1


### ¿Cómo puedo configurar? ###

* Resumen de configurar
* Como configura el servidor.
Actualmente esta funcionando en un CENTOS 7

>##IMPORTANTE EL HOST DEL SERVIDOR DEBE LLAMARSE WEBPAY

>###Ejecutar Siguintes condigo en servidor desde 0 ambiente servidor
>     
>     sudo yum -y update
>     sudo yum -y install epel-release
>     sudo yum -y install nodejs
>     sudo yum -y install npm
>     sudo yum -y install scl-utils
>     sudo yum -y groupinstall "Development Tools"
>     sudo yum -y install gettext-devel openssl-devel perl-CPAN perl-devel zlib-devel
>     sudo yum -y install wget
>     sudo yum -y install GraphicsMagick-devel
>     sudo yum -y install zlib-devel
>     sudo yum -y install bzip2-devel
>     sudo yum -y install zlib-devel
>     sudo yum -y install bzip2-devel
>     sudo yum -y install ncurses-devel
>     sudo yum -y install gcc-c++ openssl-devel
>	  sudo yum -y install libpng libjpeg libpng-devel libjpeg-devel ghostscript libtiff libtiff-devel freetype freetype-devel jasper jasper-devel
>     cd /opt
>     sudo wget --no-check-certificate https://www.python.org/ftp/python/2.7.6/Python-2.7.6.tar.xz
>     sudo tar xf Python-2.7.6.tar.xz
>     cd Python-2.7.6
>     ./configure --prefix=/usr/local
>     make && make altinstall
>     cd ..
>     sudo wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/7u79-b15/jdk-7u79-linux-x64.tar.gz"
>     sudo tar xzf jdk-7u79-linux-x64.tar.gz
>     cd jdk1.7.0_79/
>     alternatives --install /usr/bin/java java /opt/jdk1.7.0_79/bin/java 2
>     alternatives --config java
>     alternatives --install /usr/bin/jar jar /opt/jdk1.7.0_79/bin/jar 2
>     alternatives --install /usr/bin/javac javac /opt/jdk1.7.0_79/bin/javac 2
>     alternatives --set jar /opt/jdk1.7.0_79/bin/jar
>     alternatives --set javac /opt/jdk1.7.0_79/bin/javac
>     java -version
>     export JAVA_HOME=/opt/jdk1.7.0_79
>     export JRE_HOME=/opt/jdk1.7.0_79/jre
>     export PATH=$PATH:/opt/jdk1.7.0_79/bin:/opt/jdk1.7.0_79/jre/bin
>     sudo yum -y install ruby
>     ruby -v
>     sudo yum -y install ant
>     ant -version
>     which python




>     cd /
>     mkdir /dowload
>     cd /download
>     wget ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/GraphicsMagick-LATEST.tar.gz
>     tar -xzvf GraphicsMagick-LATEST.tar.gz
>     cd GraphicsMagick-1.3.21 (or the lastest graphics magick)


## Install GM with OpenMP
>     ./configure
>     make install
>     gm version

## continue installs

>     sudo npm install -g node-gyp
>     node-gyp --python /bin/python
>     npm config set python /bin/python
>     
>     sudo npm install bcrypt -g
>     sudo npm install nodemon -g
>         
>

>##Configurar accesos SSH en bitbucket
>     
>     ssh-keygen
>     cat ~/.ssh/id_rsa.pub
>     
> Copiar clave rsa a llevero de bitbucket


>##Configuraciones para correr la aplicacion
>Bajar aplicacion desdes bitbucket 
> 
>     cd ~  
>     git config --global user.email "git@webpay.cl"
>     git config --global user.name "Server webapy"
>     git clone git@github.com:hrefcl/webpay.git
>     cd api
>     npm install
>     pm2 start processes.json
>     


* Configuración
* dependencias
* Configuración de base de datos

#Crear usuario en la base de datos

        CREATE USER 'webpay'@'%' IDENTIFIED BY 'webpay#123456';
        GRANT ALL PRIVILEGES ON *.* TO 'webpay'@'%' WITH GRANT OPTION;
        FLUSH PRIVILEGES;


* Cómo ejecutar pruebas
* Instrucciones de implementación

### Directrices Contribución ###

* Pruebas de Escritura
* Revisión de código
* Otras directrices

### ¿A quién debo hablar? ###

* Propietario Repo o administrador
* Otros comunidad o equipo de contacto




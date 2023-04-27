#!/usr/bin/env bash

#
# Copyright 2020 European Commission
#
# Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
# You may not use this work except in compliance with the Licence.
# You may obtain a copy of the Licence at:
#
#     https://joinup.ec.europa.eu/software/page/eupl
#
# Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the Licence for the specific language governing permissions and limitations under the Licence.
#

#TITLE Edit Light
echo "---------------------Edit Light-----------------------------------------------"

cd ./tools/editlight || {
  echo "Can't change to ./tools/editlight"
  exit
}

echo "---------------------Edit Light COMPILING...----------------------------------"
mvn clean install
echo "---------------------Edit Light COMPILED.-------------------------------------"

cd ./web || {
  echo "Can't change to ./tools/editlight/web"
  exit
}

echo "---------------------Edit Light STARTING...-----------------------------------"
mvn spring-boot:run -Dspring-boot.run.directories=../config/target/generated-config
echo "---------------------Edit Light STOPPED....-----------------------------------"

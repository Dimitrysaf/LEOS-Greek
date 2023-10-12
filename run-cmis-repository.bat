@REM
@REM Copyright 2017 European Commission
@REM
@REM Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
@REM You may not use this work except in compliance with the Licence.
@REM You may obtain a copy of the Licence at:
@REM
@REM     https://joinup.ec.europa.eu/software/page/eupl
@REM
@REM Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the Licence for the specific language governing permissions and limitations under the Licence.
@REM

@echo off
TITLE CMIS Repository
echo "---------------------CMIS REPOSITORY-----------------------------------------------"

cd ./tools/cmis/chemistry-opencmis-server-inmemory

echo "---------------------CMIS REPOSITORY STARTING...-----------------------------------"
call mvn jetty:run-war
echo "---------------------CMIS REPOSITORY STOPPED....-----------------------------------"

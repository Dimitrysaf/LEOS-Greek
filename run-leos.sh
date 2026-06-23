#!/usr/bin/env bash

#
# Copyright 2024 European Union
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

#TITLE Leos-Pilot
echo "---------------------LEOS-----------------------------------------------"

echo "---------------------CLEANING LOCKED TARGETS...------------------------"
pkill -9 -f "surefirebooter" 2>/dev/null || true
sleep 1
rm -rf "$SCRIPT_DIR/modules/services/target" 2>/dev/null || true
rm -rf "$SCRIPT_DIR/modules/domain/target" 2>/dev/null || true

echo "---------------------LEOS COMPILING...----------------------------------"
cd "$SCRIPT_DIR"
mvn clean install
echo "---------------------LEOS COMPILED.-------------------------------------"

cd ./modules/web

echo "---------------------LEOS STARTING...-----------------------------------"
mvn cargo:run
echo "---------------------LEOS STOPPED.-----------------------------------"

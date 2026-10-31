#!/bin/bash

REPORT="analysis_report.txt"

# Alustetaan raportti
echo "====== REPOSITORION ANALYYSI ======" > $REPORT
echo "" >> $REPORT

echo "1. Havaittavat ohjelmointikielet:" | tee -a $REPORT
echo "---------------------------------" | tee -a $REPORT

find . -type f -name "*.py" | grep -q . && echo "Python (.py) löydetty" | tee -a $REPORT
find . -type f -name "*.java" | grep -q . && echo "Java (.java) löydetty" | tee -a $REPORT
find . -type f -name "*.js" | grep -q . && echo "JavaScript (.js) löydetty" | tee -a $REPORT
find . -type f -name "*.ts" | grep -q . && echo "TypeScript (.ts) löydetty" | tee -a $REPORT

echo "" | tee -a $REPORT
echo "2. Havaitut suunnittelumallit:" | tee -a $REPORT
echo "------------------------------" | tee -a $REPORT

# Singleton
grep -RnwE "getInstance|static instance" . --exclude-dir=".git" --exclude="analysoi.sh" --exclude="$REPORT" > /dev/null && echo "Singleton" | tee -a $REPORT

# Factory Method
grep -RnE "create[A-Z]|factory" . --exclude-dir=".git" --exclude="analysoi.sh" --exclude="$REPORT" > /dev/null && echo "Factory Method" | tee -a $REPORT

# Observer
grep -RnwE "notify|subscribe|observer" . --exclude-dir=".git" --exclude="analysoi.sh" --exclude="$REPORT" > /dev/null && echo "Observer" | tee -a $REPORT

# Strategy
grep -RnwE "Strategy|interface" . --exclude-dir=".git" --exclude="analysoi.sh" --exclude="$REPORT" > /dev/null && echo "Strategy" | tee -a $REPORT

# Decorator
grep -RnwE "Decorator|wrap" . --exclude-dir=".git" --exclude="analysoi.sh" --exclude="$REPORT" > /dev/null && echo "Decorator" | tee -a $REPORT

echo "" | tee -a $REPORT
echo "Analyysi suoritettu loppuun." | tee -a $REPORT
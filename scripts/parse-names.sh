# /bin/bash

for value in {1..18}
do
iconv -f 437 -t utf8 ../legacy/DATA/$value.MHX > output/$value.mhx
echo $value
done
echo All done

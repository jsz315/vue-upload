#!/bin/bash

expect << 'END'
set timeout -1
spawn ./ssr.sh
expect "teddysun.com"
send "jsz04005301\n"
expect "Default port: "
send "8888\n"
expect "Default: aes-256-gcm"
send "7\n"
expect " Press Ctrl+C to cancel"
send "\n"
expect eof
exit
END
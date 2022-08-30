import socket

clientScoket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
clientScoket.connect(('127.0.0.1',9999))

clientScoket.send("Hello, Server.")

str = clientScoket.recv(100)
print(str)

clientScoket.close()
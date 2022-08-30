import socket

serverSocket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)

serverSocket.bind(("", 9999))
serverSocket.listen(1)
(sock,addr) = serverSocket.accept()

sock.send("Hello, Client.")

str = sock.recv(100)
print(str)

sock.close()
serverSocket.close()
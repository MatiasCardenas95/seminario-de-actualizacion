class ChatServer extends HTMLElement {
    constructor() {
      super();
      this.sharedKey = null;
    }
  
    sendMessage(origin, target, message) {
      const messageEvent = new CustomEvent('message', {
        detail: { origin, target, message },
      });
      this.dispatchEvent(messageEvent);
    }
  
    async createSharedKey() {
      try {
        this.sharedKey = await window.crypto.subtle.generateKey(
          {
            name: 'AES-GCM',
            length: 256,
          },
          true,
          ['encrypt', 'decrypt']
        );
       console.log("Se creo la key correctamente");
        return this.sharedKey;
      } catch (error) {
        console.error('Error generating AES shared key:', error);
        return null;
      }
    }
  
    async encryptData(key, text) {
      try {
        const encodedText = new TextEncoder().encode(text);
        const encryptedText = await window.crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv: window.crypto.getRandomValues(new Uint8Array(12)),
          },
          key,
          encodedText
        );

        return encryptedText;
      } catch (error) {
        console.error('Error encrypting data:', error);
        return null;
      }
    }
  
    async decryptData(key, encryptedMessage) {
        try {
          const decryptedText = await window.crypto.subtle.decrypt(
            {
              name: 'AES-GCM',
              iv: window.crypto.getRandomValues(new Uint8Array(12)),
            },
            key,
            encryptedMessage
          );
          const decodedText = new TextDecoder().decode(decryptedText);
          return decodedText;
        } catch (error) {
          console.error('Error decrypting data:', error);
          return null;
        }
      }
    
      async decryptAndSend(user, encryptedMessage) {
        if (user.sharedKey) {
          try {
            const decryptedMessage = await this.decryptData(user.sharedKey, encryptedMessage);
            return decryptedMessage;
          } catch (error) {
            console.error('Error al desencriptar el mensaje:', error);
            return null;
          }
        } else {
          console.error('Clave compartida no disponible para desencriptar el mensaje.');
          return null;
        }
      }
  }
  
  customElements.define('chat-server', ChatServer);
  
  
///////////////////////////////////////////////////////////////////


// Clase para el Usuario
class User {
    constructor(username) {
      this.username = username;
      this.sharedKey = null;
    }
  }

///////////////////////////////////////////////////////////////////////////////


// Clase para el chat

class ChatModel {
    constructor() {
      this.messages = [];
    }
  
    addMessage(origin, message) {
      this.messages.push({ origin, message });
    }
  
    getMessages() {
      return this.messages;
    }
  }
  
  class ChatView {
    constructor() {
      this.container = document.createElement('div');
      this.messageList = document.createElement('ul');
      this.inputBox = document.createElement('input');
      this.sendButton = document.createElement('button');
      this.createKeyButton = document.createElement('button');
  
      this.inputBox.placeholder = 'Escribe tu mensaje';
      this.sendButton.textContent = 'Enviar';
      this.createKeyButton.textContent = 'Iniciar Conversación';
  
      this.container.appendChild(this.messageList);
      this.container.appendChild(this.inputBox);
      this.container.appendChild(this.sendButton);
      this.container.appendChild(this.createKeyButton);
  
      document.body.appendChild(this.container);
    }
  
    render(messages) {
      this.messageList.innerHTML = '';
  
      messages.forEach((message) => {
        const listItem = document.createElement('li');
        listItem.textContent = `[${message.origin}]: ${message.message}`;
        this.messageList.appendChild(listItem);
      });
    }
  
    getInput() {
      return this.inputBox.value;
    }
  
    clearInput() {
      this.inputBox.value = '';
    }
  }
  
  class ChatController {
    constructor(model, view, user1, user2, chatServer) {
      this.model = model;
      this.view = view;
      this.user1 = user1;
      this.user2 = user2;
      this.chatServer = chatServer;
  
      this.view.sendButton.addEventListener('click', this.sendMessage.bind(this));
      this.view.createKeyButton.addEventListener('click', this.createSharedKey.bind(this));
  
      this.updateView();
    }
  
    async createSharedKey() {
      try {
        const sharedKey = await this.chatServer.createSharedKey();
        if (sharedKey) {
          this.user1.sharedKey = sharedKey;
          this.user2.sharedKey = sharedKey;
          console.log('Clave compartida creada y asignada a ambos usuarios exitosamente');
        } else {
          console.error('Error al crear la clave compartida');
        }
      } catch (error) {
        console.error('Error al crear la clave compartida:', error);
      }
    }
  
    async sendMessage() {
      const message = this.view.getInput();
      if (message.trim() === '') return;
  
      if (!this.user1.sharedKey) {
        console.error('Clave compartida no disponible. Debes iniciar la conversación primero.');
        return;
      }
  
      try {
        const encryptedMessage = await this.chatServer.encryptData(this.user1.sharedKey, message);
        this.chatServer.sendMessage(this.user1.username, this.user2.username, encryptedMessage);
        console.log('Mensaje encriptado y enviado exitosamente');
      } catch (error) {
        console.error('Error al enviar el mensaje encriptado:', error);
      }
  
      this.view.clearInput();
      this.updateView();
    }

    async receiveMessage(encryptedMessage, sender) {
        if (this.user1 === sender) {
          const decryptedMessage = await this.chatServer.decryptAndSend(this.user1, encryptedMessage);
          if (decryptedMessage) {
            this.model.addMessage(sender.username, decryptedMessage);
            this.updateView();
            console.log('Mensaje desencriptado y recibido exitosamente por', this.user1.username);
          }
        } else if (this.user2 === sender) {
          const decryptedMessage = await this.chatServer.decryptAndSend(this.user2, encryptedMessage);
          if (decryptedMessage) {
            this.model.addMessage(sender.username, decryptedMessage);
            this.updateView();
            console.log('Mensaje desencriptado y recibido exitosamente por', this.user2.username);
          }
        } else {
          console.error('Usuario desconocido.');
        }
      }
  
    updateView() {
      const messages = this.model.getMessages();
      this.view.render(messages);
    }
  }
  
  // ... (código restante)
  
  

  const user1 = new User('User1');
  const user2 = new User('User2');
  const chatServer = new ChatServer();
  
  const chatModel = new ChatModel();
  const chatView = new ChatView();
  const chatController = new ChatController(chatModel, chatView, user1, user2, chatServer);
  
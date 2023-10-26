/////////////////MVC CLASSS CHAT//////////////////////////////////////////

class ChatModel 
{
  constructor() 
  {
    this.messages = [];
  }

  addMessage(origin, message) 
  {
    this.messages.push({ origin, message });
  }

  getMessages() 
  {
    return this.messages;
  }
}

class ChatView 
{
  //Posible modificacion a futuro de parametros del nombre y ubicacion a la vista
  constructor(username, isRightSide) 
  {
    this.container = document.createElement('div');
    this.container.className = isRightSide ? 'chat-container right' : 'chat-container left';

    this.messageContainer = document.createElement('div');
    this.messageContainer.className = 'message-container';

    this.messageList = document.createElement('ul');
    this.messageList.className = 'message-list';

    this.inputBox = document.createElement('input');
    this.inputBox.className = 'message-input';
    this.inputBox.placeholder = 'Escribe tu mensaje';

    this.sendButton = document.createElement('button');
    this.sendButton.className = 'send-button';
    this.sendButton.textContent = 'Enviar';

    this.createKeyButton = document.createElement('button');
    this.createKeyButton.className = 'create-key-button';
    this.createKeyButton.textContent = 'Iniciar Conversación';

    this.usernameLabel = document.createElement('div');
    this.usernameLabel.className = 'username-label';
    this.usernameLabel.textContent = `Usuario: ${username}`;

    this.messageContainer.appendChild(this.messageList);
    this.container.appendChild(this.usernameLabel);
    this.container.appendChild(this.messageContainer);
    this.container.appendChild(this.inputBox);
    this.container.appendChild(this.sendButton);
    this.container.appendChild(this.createKeyButton);

    document.body.appendChild(this.container);
  }

render(messages)
{
  // Limpia la lista de mensajes
  while (this.messageList.firstChild) {
    this.messageList.removeChild(this.messageList.firstChild);
  }

  messages.forEach((message) => {
    const listItem = document.createElement('li');
    const text = document.createTextNode(`[${message.origin}]: ${message.message}`);
    listItem.appendChild(text);
    this.messageList.appendChild(listItem);
  });
}

  getInput() 
  {
    return this.inputBox.value;
  }

  clearInput() 
  {
    this.inputBox.value = '';
  }
}

class ChatController 
{
  //Simulacion de Chat entre dos usuarios, con sus vistas, y el server...... a modificar
  constructor(model, view1, view2, user1, user2, chatServer) 
  {
    this.model = model;
    this.view1 = view1;
    this.view2 = view2;
    this.user1 = user1;
    this.user2 = user2;
    this.chatServer = chatServer;

    this.view1.sendButton.addEventListener('click', this.sendMessage.bind(this, user1));
    this.view2.sendButton.addEventListener('click', this.sendMessage.bind(this, user2));
    this.view1.createKeyButton.addEventListener('click', this.createSharedKey.bind(this));
    this.view2.createKeyButton.style.display = 'none';

    this.chatServer.addEventListener('message', this.receiveMessage.bind(this));

    this.updateView();
  }

  async createSharedKey() 
  {
    try 
    {
      const sharedKey = await this.chatServer.createSharedKey();
      if (sharedKey) 
      {
        this.user1.sharedKey = sharedKey;
        this.user2.sharedKey = sharedKey;
        console.log('Clave compartida creada y asignada a ambos usuarios exitosamente');
      } 

      else 
      {
        console.error('Error al crear la clave compartida');
      }
    } 

    catch (error) 
    {
      console.error('Error al crear la clave compartida:', error);
    }
  }

  async sendMessage(user, event) 
  {
    const message = user === this.user1 ? this.view1.getInput() : this.view2.getInput();
    if (message.trim() === '') return;

    if (!user.sharedKey) 
    {
      console.error('Clave compartida no disponible. Debes iniciar la conversación primero.');
      return;
    }

    try 
    {
      const encryptedMessage = await this.chatServer.encryptData(user.sharedKey, message);
      this.chatServer.sendMessage(user.username, user === this.user1 ? this.user2.username : this.user1.username, encryptedMessage);
      console.log(`Mensaje encriptado y enviado exitosamente por ${user.username}`);
    } 

    catch (error) 
    {
      console.error(`Error al enviar el mensaje encriptado por ${user.username}:`, error);
    }

    if (user === this.user1) 
    {
      this.view1.clearInput();
    } 
    else 
    {
      this.view2.clearInput();
    }

    this.updateView();
  }

  receiveMessage(event) 
  {
    const { origin, target, message, iv } = event.detail;
  
    if (target === this.user1.username) 
    {
      const view = this.view1;
      this.decryptAndDisplayMessage(this.user1, origin, message, view, iv);
    } 
    
    else if (target === this.user2.username) 
    {
      const view = this.view2;
      this.decryptAndDisplayMessage(this.user2, origin, message, view, iv);
    }
  }
  
  async decryptAndDisplayMessage(user, origin, encryptedMessage, view, iv) 
  {
    if (!user.sharedKey) 
    {
      console.error('Clave compartida no disponible para desencriptar el mensaje.');
      return;
    }
  
    try 
    {
      const decryptedMessage = await this.chatServer.decryptData(user.sharedKey, encryptedMessage, iv);
      this.model.addMessage(origin, decryptedMessage);
      this.updateView();
      console.log(`Mensaje desencriptado y recibido por ${user.username}`);
      view.render(this.model.getMessages());
    } 

    catch (error) 
    {
      console.error(`Error al desencriptar y mostrar el mensaje para ${user.username}:`, error);
    }
  }
  

  updateView() 
  {
    this.view1.render(this.model.getMessages());
    this.view2.render(this.model.getMessages());
  }
}

//////////CLass User//////////////////////
class User 
{
  constructor(username) 
  {
    this.username = username;
    this.sharedKey = null;
  }
}

/////////Class Server///////////////////////
class ChatServer extends HTMLElement 
{
  constructor() 
  {
    super();
    this.sharedKey = null;
  }

  sendMessage(origin, target, message) 
  {
    const messageEvent = new CustomEvent('message', {
      detail: { origin, target, message },
    });
    this.dispatchEvent(messageEvent);
  }

  async createSharedKey() 
  {
    try 
    {
      this.sharedKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );

      return this.sharedKey;
    } 
    catch (error) 
    {
      console.error('Error generating AES shared key:', error);
      return null;
    }
  }

  async encryptData(key, text) 
  {
    try 
    {
      const encodedText = new TextEncoder().encode(text);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedText = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encodedText
      );

      return { encryptedText, iv };
    } 

    catch (error) 
    {
      console.error('Error encrypting data:', error);
      return null;
    }
  }

  async decryptData(key, { encryptedText, iv }) 
  {
    try 
    {
      const decryptedText = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encryptedText
      );
      const decodedText = new TextDecoder().decode(decryptedText);
      return decodedText;
    } 
    
    catch (error) 
    {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
}

customElements.define('chat-server', ChatServer);


const view1 = new ChatView('Matias', false); 
const view2 = new ChatView('Maximiliano', true); 

const user1 = new User('Matias');
const user2 = new User('Maximiliano');
const chatServer = new ChatServer();

const chatModel = new ChatModel();

const chatController = new ChatController(chatModel, view1, view2, user1, user2, chatServer);

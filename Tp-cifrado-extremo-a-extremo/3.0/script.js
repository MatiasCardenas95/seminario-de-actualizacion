class ChatView {
    constructor() {
      this.container = document.createElement('div');
      this.container.className = 'chat-container';
  
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
  
      this.initConversationButton = document.createElement('button');
      this.initConversationButton.className = 'init-conversation-button';
      this.initConversationButton.textContent = 'Iniciar Conversación';
  
      this.usernameLabel = document.createElement('div');
      this.usernameLabel.className = 'username-label';
      this.usernameLabel.textContent = `Usuario: John`; // Cambiar el nombre de usuario según sea necesario
  
      this.messageContainer.appendChild(this.messageList);
      this.container.appendChild(this.usernameLabel);
      this.container.appendChild(this.messageContainer);
      this.container.appendChild(this.inputBox);
      this.container.appendChild(this.sendButton);
      this.container.appendChild(this.initConversationButton);
  
      document.body.appendChild(this.container);
    }
  
    // Método para agregar un mensaje a la vista
    addMessage(messageText) {
      const messageItem = document.createElement('li');
      messageItem.textContent = messageText;
      this.messageList.appendChild(messageItem);
    }
  }
  
  class ChatController {
    constructor(view) {
      this.view = view;
      // Manejar eventos, como hacer clic en el botón de enviar
      this.view.sendButton.addEventListener('click', () => this.sendMessage());
    }
  
    sendMessage() {
      const messageInput = this.view.inputBox.value;
      if (messageInput) {
        // Enviar el mensaje al servidor (debes implementar esta parte)
        // Después de enviar el mensaje, puedes agregarlo a la vista
        this.view.addMessage(messageInput);
        this.view.inputBox.value = ''; // Borrar el campo de entrada
      }
    }
  }
  
  const chatView = new ChatView();
  const chatController = new ChatController(chatView);
  
  // Iniciar la comprobación periódica de mensajes (deberás implementar esta parte)
  function pollForMessages() {
    // Obtener nuevos mensajes del servidor y agregarlos a la vista
    const newMessages = ['Nuevo mensaje 1', 'Nuevo mensaje 2'];
    newMessages.forEach(message => {
      chatView.addMessage(message);
    });
  }
  
  pollForMessages(); // Iniciar la comprobación periódica de mensajes
  
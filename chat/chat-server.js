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
      console.log(encodedText);
      return encryptedText;
    } catch (error) {
      console.error('Error encrypting data:', error);
      return null;
    }
  }

  async decryptData(key, encryptedText) {
    try {
      const decryptedText = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: window.crypto.getRandomValues(new Uint8Array(12)),
        },
        key,
        encryptedText
      );
      const decodedText = new TextDecoder().decode(decryptedText);
      return decodedText;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
}

customElements.define('chat-server', ChatServer);


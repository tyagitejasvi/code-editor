# ProCode Editor

A modern, responsive code editor for writing and testing HTML, CSS & JavaScript code in real-time.

## 🌟 Features

✨ **Live Preview** - See your code changes instantly in real-time  
💾 **Auto-save** - Your code is automatically saved to browser storage  
↩️ **Undo Functionality** - 50-step history with Ctrl+Z support  
📥 **Download Code** - Export your project as a complete HTML file  
🎨 **Modern Dark Theme** - Professional design with gradient backgrounds  
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile  
⌨️ **Keyboard Shortcuts** - Ctrl+S (download), Ctrl+Z (undo), Ctrl+Shift+L (clear)  
🔧 **Error Handling** - JavaScript errors are caught and displayed safely  

## 🚀 Live Demo

🔗 **[Open Live Demo](https://tyagitejasvi.github.io/code-editor)**


## 📖 How to Use

1. **Write Code** - Type HTML, CSS, and JavaScript in their respective panels
2. **Live Preview** - See your changes instantly in the output panel
3. **Debug** - Use browser console (F12) to check JavaScript logs
4. **Download** - Save your complete project as an HTML file
5. **Share** - Copy the live demo link to share your work

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Interactive functionality and DOM manipulation
- **localStorage** - Client-side data persistence
- **Boxicons** - Beautiful icons and UI elements

## 📁 Project Structure

```
code-editor/
├── codeeditor.html    # Main HTML file
├── codeeditor.css     # Styling and themes
├── app.js            # JavaScript functionality
└── README.md         # Project documentation
```

## 🎯 Example Usage

**HTML Panel:**
```html
<h1>Hello World!</h1>
<button id="myBtn">Click Me</button>
```

**CSS Panel:**
```css
h1 {
  color: #667eea;
  text-align: center;
  font-size: 2rem;
}

button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
```

**JavaScript Panel:**
```javascript
document.getElementById('myBtn').addEventListener('click', () => {
  alert('Button clicked!');
  console.log('Hello from JavaScript!');
});
```

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tyagitejasvi/code-editor.git
   cd code-editor
   ```

2. **Open in browser:**
   - Double-click `codeeditor.html` or
   - Use a local server (recommended for better functionality)

3. **Start coding!** 🎉

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**  
- GitHub: [tyagitejasvi](https://github.com/tyagitejasvi)


---

⭐ **Star this repo** if you found it helpful!  
🔗 **Live Demo:** https://tyagitejasvi.github.io/code-editor

var path=require("path")
var commandConfig = {
    watch: true,
    entry: "./src/commands/commands.js",
    output: {
      filename: "commands.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var taskpaneConfig = {
    watch: true,
    entry: "./src/taskpane/taskpane.js",
    output: {
      filename: "taskpane.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var cwindowConfig = {
    watch: true,
    entry: "./src/Compose_Window/com-window.js",
    output: {
      filename: "com-window.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var reciverConfig = {
    watch: true,
    entry: "./src/Reciver_Window/rec-window.js",
    output: {
      filename: "rec-window.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var contactConfig = {
    watch: true,
    entry: "./src/Compose_Window/contact_Screen.js",
    output: {
      filename: "contact_Screen.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var logConfig = {
    watch: true,
    entry: "./src/Compose_Window/login.js",
    output: {
      filename: "login.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };

  var signupConfig = {
    watch: true,
    entry: "./src/Compose_Window/signup.js",
    output: {
      filename: "signup.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var searchConfig = {
    watch: true,
    entry: "./src/Search_Window/search_window.js",
    output: {
      filename: "search_window.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var SignUpDetail = {
    watch: true,
    entry: "./src/SignUpWindow/SignUpDetails.js",
    output: {
      filename: "SignUpDetails.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var SignUpOTP = {
    watch: true,
    entry: "./src/SignUpWindow/SignUpOTP.js",
    output: {
      filename: "SignUpOTP.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var SignUpSuccess = {
    watch: true,
    entry: "./src/SignUpWindow/SignUpSuccess.js",
    output: {
      filename: "SignUpSuccess.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var IndexingLogic= {
    watch: true,
    entry: "./src/Indexing/IndexingLogic.js",
    output: {
      filename: "IndexingLogic.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var Pass= {
    watch: true,
    entry: "./src/Passphrase-Screen.js",
    output: {
      filename: "Passphrase-Screen.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var PassStore= {
    watch: true,
    entry: "./src/Passphrase-store.js",
    output: {
      filename: "Passphrase-store.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  var PassDelete= {
    watch: true,
    entry: "./src/Passphrase-Delete.js",
    output: {
      filename: "Passphrase-Delete.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      usedExports: true,
    },
  };
  module.exports = [commandConfig,taskpaneConfig,cwindowConfig,reciverConfig,contactConfig,logConfig,signupConfig,searchConfig,SignUpDetail,SignUpOTP,SignUpSuccess,IndexingLogic,Pass,PassStore,PassDelete];

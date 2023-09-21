//tüm elementleri seçtim
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");//bir<input>
const firstCardBody = document.querySelectorAll(".card-body")[0];//cardbodyden 2 tane olduğu için ALL
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners();

function eventListeners() {//bütün eventlistenerlar
    form.addEventListener("submit", addTodo);//form ögesi içinde submit olayını dinliyor
    //submit olunca addtodo fonksiyonunu çalıştır demek
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);//Kullanıcıların bir web sayfasına giriş yapma anından, içeriğin yüklenmesine kadar geçen süre
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);//filtera event ekledim
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos(e){
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);//hiç bir todo kalmayana dek todoları siler
        }
        localStorage.removeItem("todos");//keyini(todos) vererek local storagedan tüm itemleri sildim

    }
    //arayüzden todoları temizle

}
function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    //filtreleme
    listItems.forEach(function(listItem){
       const text = listItem.textContent.toLowerCase();
       if(text.indexOf(filterValue) === -1){
        //bulunamadı
        listItem.setAttribute("style","display : none !important");//bootstrap kullanmıştık kodumuzda ve clası dflexti 
        //bu dflex display none ı gölgeler ona engel olmak için imp yazdık
       }
       else{
        listItem.setAttribute("style","display : block ");
       }
    })

}
function deleteTodo(e){//todoları arayüzden silme
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();//i a li(liyi sildi)
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","todo başarıyla silindi...")
    }
}
function deleteTodoFromStorage(deletetodo){
      let todos = getTodosFromStorage();

      todos.forEach(function(todo,index){
         if(todo === deletetodo){
           todos.splice(index,1)//o indexten itibaren bir tane yani sadece bu indexi sildik
         }
      });
      localStorage.setItem("todos",JSON.stringify(todos));

}
//local storagedan daha önce eklenmiş olan todoları sayfa yüklendiğinde sayfada gösteriyor olur
function loadAllTodosToUI(){
     let todos = getTodosFromStorage();
      
     todos.forEach(function(todo){
        addTodoToUI(todo);

     })
}

function addTodo(e) {

    const newTodo = todoInput.value.trim();//inputun değerini aldım trim ise baş ve sondaki boşlukları keser
    console.log(newTodo);

    if (newTodo === "") {
        showAlert("danger", "lütfen bir todo girin..");//type ve message
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Başarıyla eklendi...")
    }



    e.preventDefault();//default olarak sayfaya yönleniyor bunu önlemeye çalıştık
}

function getTodosFromStorage() {//storagedan bütün todoları aldım
    let todos;

    if (localStorage.getItem("todos") === null) {//oluşmuş bir array yoksa oluştur
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));

    }
    return todos;
}
//local storage a veri ekleme
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);//bana gönderilen stringi ekledim

    localStorage.setItem("todos", JSON.stringify(todos));

}

function showAlert(type, message) {

    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;
    firstCardBody.appendChild(alert)

    console.log(alert)
    //settimeout
    setTimeout(function () {
        alert.remove();
    }, 1000)

}

function addTodoToUI(newTodo) {//stringi alıp listitem olarak ekleyecek
    const listItem = document.createElement("li");
    // Bir bağlantı öğesi oluştur
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between"
    //textnode eklendi
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //todoliste li oluşan li yi ekleyelim
    todoList.appendChild(listItem);
    todoInput.value = "";//yazıyı yazıp butona basınca silinsin yazı

    console.log(listItem);

}
const submitButton1 = document.getElementById("submit-button1");
const result = document.getElementById("preview");


submitButton1.addEventListener('click', (evt) => {
  evt.preventDefault()
  data = {'key1': 'orange', 'key2': 'apple', 'key3': 'banana'};
  const xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://txs7jw7rdd.execute-api.ap-northeast-1.amazonaws.com/dev/sample-test')

  xhr.setRequestHeader( 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8' );
  xhr.send(JSON.stringify(data))

  xhr.onreadystatechange = function() {
    if( xhr.readyState === 4 && xhr.status === 200 ) {
      //エラーを出さずに通信が完了した時の処理。例↓
      console.log( xhr.responseText );
      res = JSON.parse(xhr.responseText);
      result.innerHTML = res["body"];
    }
  }
})
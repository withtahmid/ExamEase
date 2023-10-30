function indexDropdownToggle(id = "default"){
    document.querySelectorAll('.accordion-content').forEach(val =>{
      val.style.maxHeight = null;
    });

    const content = document.getElementById(id).querySelector('.accordion-content');
    if(!content){
      return;
    }
    content.style.maxHeight = content.scrollHeight + 'px';
  }

  function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

const index = document.getElementById("index");
const topics = Array.from(document.querySelectorAll(".accordion-header"));
const subTopic = index.querySelectorAll("p");

const clearHeadercColor = () =>{
  topics.forEach(val =>{
    val.classList.remove('selected-header');
  });
}

const clearTopicColor = () =>{
  subTopic.forEach(val =>{
    val.classList.remove('selected-topic');
  });
}

const reset = () =>{
  clearHeadercColor();
  clearTopicColor();
  // document.querySelectorAll(".accordion-content").forEach(val =>{
  //   val.style.maxHeight = null
  // });
}

index.addEventListener("click", function(event) {
    const clickedElement = event.target;
    if(clickedElement.classList.contains('accordion-header')){
      reset();
      clickedElement.maxHeight = clickedElement.scrollHeight + 'px';
      clickedElement.classList.add('selected-header');

    }else if(clickedElement.tagName === "P"){
      reset();
      // clickedElement.parentNode.maxHeight = clickedElement.parentNode.scrollHeight + 'px';
      clickedElement.parentNode.parentNode.querySelector('.accordion-header').classList.add('selected-header');
      clickedElement.classList.add('selected-topic');
    }
});
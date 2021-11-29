const popupLinks=document.querySelectorAll('.popup-link');
const body=document.querySelector('body');
const lockPadding=document.querySelectorAll(".lock-padding");//фиксированные элементы


let unlock=true;
const timeout=800;//время анимации попапа

if(popupLinks.length>0)
{
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click",function(event)
        {
            const popupName=popupLink.getAttribute('href').replace('#','');
            const curentPopup=document.getElementById(popupName);
            popupOpen(curentPopup);
            const form=document.getElementById('form');
            form.addEventListener('submit',formSend);
            event.preventDefault();
        });
    }
}

const popupCloseIcon=document.querySelectorAll('.close-popup');
if(popupCloseIcon.length>0)
{
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const Icon = popupCloseIcon[index];
        Icon.addEventListener('click',function(event)
        {
            popupClose(Icon.closest('.popup'));
            event.preventDefault();
        });
    }
}

function popupOpen(curentPopup)
{
    if(curentPopup && unlock)//проверка на даблклик
    {
        history.pushState(null,null,"Form");
        const popupActive=document.querySelector('.popup.open');
        if(popupActive)
        {
            popupClose(popupActive,false);
        }
        else bodyLock();//скрывать прокрутку нужно только если не было открытых попапов

    curentPopup.classList.add('open');

    //Если есть темная область вокруг попапа, можно закрывать его при нажатии на эту область:
    curentPopup.addEventListener("click",function(event)
    {
        if(!event.target.closest('.popup_content'))
        {
            popupClose(event.target.closest('.popup'));
        }
    });

    }
}

function popupClose(popupActive, doUnlock = true)//doUnlock - нужно ли возращать скрол
{
    if(unlock)
    {
        window.history.back();
        popupActive.classList.remove('open');
        if(doUnlock)
            bodyLock();
    }
}

function bodyLock()//лочит скрол
{
    const lockPaddingValue=window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    
    if(lockPadding.length>0)
    {
        for (let index = 0; index < lockPadding.length; index++) 
        {
            const element = lockPadding[index];
            element.style.paddingRight=lockPaddingValue;
        }
    }
    body.style.paddingRight=lockPaddingValue;
    body.classList.add('lock');

    unlock=false;//защита от даблкликов
    setTimeout(function()
    {
        unlock=true;
    },timeout);

}

function bodyUnLock()
{
    setTimeout(function(){
        if(lockPadding.length>0)
        {
          for (let index = 0; index < lockPadding.length; index++) {
               const el = lockPadding[index];
              el.style.paddingRight='opx';
          }
        }
        body.style.paddingRight='0px';
        body.classList.remove('lock');
    },timeout);
    unlock=false;
    setTimeout(function(){
        unlock=true;
    },timeout);
}

window.addEventListener("popstate", function (event)//закрытие при нажатии на стрелку
{
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
});

document.addEventListener('keydown', function (event) //закрытие при нажатии на Esc
{
    if (event.code === "Escape")
    {
        const popupActive=document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

async function formSend(event)
{
    event.preventDefault();
    let error = formValidate(form);
    let formData=new FormData(form);

    if(error===0)
    {
        const popup_content = document.getElementById('popup_content');
        popup_content.classList.add('_sending');
        let response=await fetch('sendmail.php',{
            method:'POST',
            body:formData
        });
        if(response.ok)
        {
            let result=await response.json();
            alert(result.message);
            form.reset();
            popup_content.classList.remove('_sending');
        }else
        {
            popup_content.classList.remove('_sending');
            alert("Ошибка отправки формы");
        }
    }
}

function formValidate(form)
{
    let error=0;
    let formReq = document.querySelectorAll('._req');
    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemoveError(input);
        if(input.classList.contains('.email'))
        {
            if(emailTest(input))
            {
                formAddError(input);
                error++;
            }
        } else if (input.getAttribute("type")==="checkbox" && input.checked===false) 
        {
            formAddError(input);
            error++;
        }else 
        {
            if(input.value==='')
            {
                formAddError(input);
                error++;
            }
        }  
    }
    return error;
}

function formAddError(input)
{
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}

function emailTest(input)
{
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

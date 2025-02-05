function addAttendFromTop() {

    

    const sections = document.querySelectorAll('.T_I_section');
    for (let section of sections) {
        const a = section.children[0];
        const href = `${a.getAttribute('href')}`.split("/")[3];
        //出席ボタンの追加
        if(section.querySelector('br')){
            section.querySelector('br').remove();
        }
        //出席ボタンの追加
        //画像の追加
        const attend_button = document.createElement("i");
        attend_button.classList.add("fas");
        attend_button.classList.add("fa-user-plus");
        attend_button.classList.add("attend_button");
        //画像サイズの調整
        // attend_button.style.width = "25px";
        // attend_button.style.height = "25px";
        attend_button.style.fontSize = "16px";
        attend_button.style.cursor = "pointer";
        attend_button.style.color = "gray";
        //onclickイベントの追加
        attend_button.setAttribute("onclick", `checkAttendEntry(${href});`) 


    
        //ボタンの実装
        let div_right = document.createElement("div");
        div_right.classList.add("text-right");
        div_right.appendChild(attend_button);
        section.insertBefore(div_right, section.children[1]);
    }


}




// fetch("https://portal.iwasaki.ac.jp/lms/?class_id=7500&action=glexa_modal_entry_form&_=1738728806391", {
//     "headers": {
//       "accept": "*/*",
//       "accept-language": "ja,en-US;q=0.9,en;q=0.8",
//       "priority": "u=1, i",
//       "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": "\"Windows\"",
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "same-origin",
//       "x-requested-with": "XMLHttpRequest"
//     },
//     "referrer": "https://portal.iwasaki.ac.jp/lms/",
//     "referrerPolicy": "strict-origin-when-cross-origin",
//     "body": null,
//     "method": "GET",
//     "mode": "cors",
//     "credentials": "include"
//   });

{/* <script>
	$(function() {
		// event setup
		$('.button-send-entry').off().on('click', function(e) {
			glexa.ajaxForm({
				form: '#form-entry',
				method: 'get',
				onSuccess: function() {
					glexa.closeRemoteModal();
					glexa.alert('出席を受け付けました');
					isClassEntryOpened = false;
				}
			});
		});
		
		// first load
	});
</script>

<div class="modal-dialog modal-lg">
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="glyphicon glyphicon-remove"></i></button>
			<h4 class="modal-title">出欠カード</h4>
		</div>
		<div class="modal-body">
							<div class="form-inline">
					<form id="form-entry">
						<input type="hidden" name="action" value="glexa_modal_entry_form_accept" />
						<input type="hidden" name="class_id" value="7500" />
						<input type="hidden" name="directory_id" value="0" />
						<input type="hidden" name="entry_id" value="" />
						<input type="hidden" name="uniqid" value="836f130aa57f29bb74f423f7070ecde6904bea88694747f9d2a1f11ec080dfb0" />

											</form>
				</div>
					</div><!--modal-body-->
		<div class="modal-footer">
			<button class="btn btn-primary button-send-entry size10">出席</button>
		</div>
	</div><!--modal-content-->
</div><!--modal-dialog--> */}

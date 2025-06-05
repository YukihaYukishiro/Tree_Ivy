console.log("Overrider settings loaded");

window.addEventListener("load", async () => {
    const container = await waitForElement("body > div.v2-container > div > div.main.sp-margin-bottom-md");
    const settingsPanel = document.createElement("div");
    settingsPanel.className = "container";
    settingsPanel.innerHTML = `													
<div class="panel panel-default">
	<div class="panel-heading" style="font-size: 1.5em;">
		<i class="mark"></i>Tree_Ivy 設定変更
									<a href="/lms/" class="float-right btn btn-primary btn-radius"><i class="glyphicon glyphicon-chevron-left"></i> トップへ戻る</a>
						</div>
	<div class="panel-body">
	
	</div><!--panel-body-->
</div><!--panel-->`;
    container.prepend(settingsPanel);
    
    
    
});
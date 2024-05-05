$(document).ready(function(){
	SiteManager.Init();
});

let SiteManager = {
	sites: null,
	selectedSite : null,
	url: "",
	action: "",
	editSiteModal: null,
	removeSiteModal: null,

	Init: function () {	
		this.editSiteModal = new bootstrap.Modal("#editSiteModal");
		this.removeSiteModal = new bootstrap.Modal("#editSiteModal");
		
		$("#addSiteButton").click(function(){
			SiteManager.action = "add";
			SiteManager.url = api_url + "add_site";
			SiteManager.selectedSite = null;
			
			$('#editSiteModal').find("#editModalTitle").html("Ajouter un site");
			$('#editSiteModal').find("input, textarea, select").val("");
			$('#editSiteModal').find("#acceptEditButton").html("Ajouter");

			SiteManager.editSiteModal.show();
		});
		
		$('#editSiteModal').find("form").submit(function(){
			var data = {
				name: $('#editSiteModal').find("#nameInput").val(),
				url: $('#editSiteModal').find("#urlInput").val(),
				frequency: $('#editSiteModal').find("#frequencyInput").val(),
				next_date: $('#editSiteModal').find("#nextDateInput").val()
			};
			
			if(SiteManager.action == "edit")
				data.id_site = SiteManager.selectedSite.id;

			$.ajax({
				url: SiteManager.url,
				type: "POST",
				data: data,
				success: function() {
					SiteManager.Refresh();
					SiteManager.editSiteModal.hide();
				}
			});
	
			return false;
		});
	
		$('#removeSiteModal').find("form").submit(function(){
			$.ajax({
				url: SiteManager.url,
				type: "POST",
				data: {
					id_site: SiteManager.selectedSite.id
				},
				success: function() {
					SiteManager.Refresh();
					SiteManager.removeSiteModal.hide();
				}
			});
	
			return false;
		});
	
		this.Refresh();
	},
	
	Refresh: function ()
	{
		$.ajax({
			url: api_url + "sites",
			type: "POST",
			success: function(data) {
				SiteManager.sites = data.sites;
				
				$("#nbSites").html(SiteManager.sites.length + "");
				$("#tableSites tbody").html("");

				for (let i = 0; i < SiteManager.sites.length; i ++) {
					SiteManager.AddSite(SiteManager.sites[i]);
				}
			}
		});
	},
	
	AddSite: function(site)
	{
		let actions = $("<td class='text-end'></td>");
		actions.append("<button class='modify-site btn btn-secondary' data-id='" + site.id + "'><i class='fas fa-pen'></i></button> ");
		actions.append("<button class='remove-site btn btn-danger' data-id='" + site.id + "'><i class='fas fa-trash-alt'></i></button>");
		
		actions.find(".modify-site").click(function(){
			SiteManager.action = "edit";
			SiteManager.url = api_url + "edit_site";
			SiteManager.selectedSite = site;
			
			$('#editSiteModal').find("#editModalTitle").html("Modifier le site");
			$('#editSiteModal').find("#nameInput").val(SiteManager.selectedSite.name);
			$('#editSiteModal').find("#urlInput").val(SiteManager.selectedSite.url);
			$('#editSiteModal').find("#frequencyInput").val(SiteManager.selectedSite.frequency);
			$('#editSiteModal').find("#nextDateInput").val(SiteManager.selectedSite.next_date);
			$('#editSiteModal').find("#acceptEditButton").html("Modifier");

			SiteManager.editSiteModal.show();
		});
		
		actions.find(".remove-site").click(function(){
			SiteManager.action = "remove";
			SiteManager.url = api_url + "remove_site";
			SiteManager.selectedSite = site;

			$("#removeSiteModal").find("#nameSite").html(SiteManager.selectedSite.name);

			SiteManager.removeSiteModal.show();
		});
	
		let row = $("<tr></tr>");
		row.append("<td>" + site.name + "</td>");
		row.append("<td>" + site.frequency + "</td>");
		row.append("<td>" + site.next_date + "</td>");
		row.append(actions);
		
		$("#tableSites tbody").append(row);
	}
}
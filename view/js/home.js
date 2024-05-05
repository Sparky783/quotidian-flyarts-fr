$(document).ready(function(){
	Home.Init();
});

var Home = {
	sites: [],

	Init: function () {
		$(".filter").click(function(){
			var type = $(this).data("filter-type");
			
			if(type == "all") {
				$(".q-link").show();
			} else {
				$(".q-link").hide();

				$(".q-link").each(function(){
					if($(this).data("frequency") == type)
						$(this).show();
				});
			}
		});

		this.Refresh();
	},

	Refresh: function() {
		$.ajax({
			url: url_api + "get_sites",
			type: "POST",
			success: function(result) {
				if(result.sites.length > 0)
				{
					Home.sites = result.sites;
					Home.DisplaySites();
					Home.EnableLinks();
				}
				else
					console.log("Impossible de mettre à jour la base de donnée.");
			}
		});
	},

	DisplaySites: function() {
		$("#sitesList").html("");

		for(var i = 0; i < this.sites.length; i++)
		{
			if(this.sites[i].to_visit)
				this.DisplaySite(this.sites[i]);
		}

		for(var i = 0; i < this.sites.length; i++)
		{
			if(!this.sites[i].to_visit)
				this.DisplaySite(this.sites[i]);
		}
	},

	DisplaySite: function(site) {
		var html = "<tr class='q-link row-" + site.frequency + "' data-link='" + site.url + "' data-id='" + site.id + "' data-frequency='" + site.frequency + "'>";
		html += "<td class='type-column'><i class='fas fa-circle dot-" + site.frequency + "'></i></td>";

		html += "<td class='title-column'>" + site.name + "<br /><span class='last-visit'>Visité le " + site.last_visit + "</span></td>";

		if(!site.to_visit)
			html += "<td class='is-check-column'><i class='fas fa-check'></i></td>";
		else
			html += "<td class='is-check-column'></td>";

		html += "<td class='external-column'><i class='fas fa-external-link-alt'></i></td>";
		html += "</tr>";

		$("#sitesList").append(html);
	},

	EnableLinks: function() {
		$(".q-link").click(function(){
			var url = $(this).data("link");
			
			$.ajax({
				url: url_api + "visit_site",
				type: "POST",
				data: {
					id_site: $(this).data("id")
				},
				success: function(result) {
					if(result)
					{
						window.open(url);
						Home.Refresh();
					}
					else
						console.log("Impossible de mettre à jour la base de donnée.");
				}
			});
		});
	}
}
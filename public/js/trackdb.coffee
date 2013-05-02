Track = Backbone.Model.extend(
  defaults:
    Name: "Default Name"
    Artist: "Artist Name"
    Album: "Album Name"

  idAttribute: "_id"
  initialize: ->
    @on "change", (model) ->
)

Tracks = Backbone.Collection.extend(
  model: Track
  url: ->
    term = $("#search-term").val() or "hello"
    url = "/search/" + term
    url

  initialize: ->
    _.bindAll this, "retrieve"
    @retrieve()

  retrieve: ->
    self = this
    @fetch
      success: (collection, response, options) ->
        self.reset()
        self.add response.result
        self.trigger "change"

      error: (collection, xhr, options) ->

)
TrackView = Backbone.View.extend(
  tagName: "tr"
  initialize: ->
    _.bindAll this, "render"
    @model.bind "change", @render

  render: ->
    self = this
    $(@el).html "<td><i class=\"icon-music\"></i> " +
    self.model.get("Name") +
    "</td>" +
    "<td>" +
    self.model.get("Album") +
    "</td>" +
    "<td>" +
    self.model.get("Artist") +
    "</td>"
    this
)
ListView = Backbone.View.extend(
  el: "#tracks"
  initialize: ->
    self = this
    _.bindAll this, "render", "appendTrack"
    @collection = new Tracks()
    @collection.bind "change", @render

  render: ->
    self = this
    console.log "TracksView.render"
    @$el.html ""
    _(@collection.models).each ((item) ->
      self.appendTrack item
    ), this
    this

  appendTrack: (item) ->
    trackView = new TrackView(model: item)
    $("#tracks").append trackView.render().el
)
SearchView = Backbone.View.extend(
  el: "#search-form"
  initialize: ->
    _.bindAll this, "render", "goSearch"
    @render()

  events:
    "click #search-button": "goSearch"

  render: ->
    template = _.template($("#search-template").html(), {})
    @$el.append template
    this

  goSearch: (e) ->
    e.preventDefault()
    listView.initialize()
)
listView = new ListView()
searchView = new SearchView()
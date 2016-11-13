/**
 * Artist module
 */
define(['ojs/ojcore', 'knockout', 'jquery', '../spotify', 'knockout-postbox',
  'ojs/ojchart', 'ojs/ojrouter'],
  function (oj, ko, $, spotify) {
    /**
     * The view model for the Artist module
     */
    function ArtistViewModel () {
      var addAlbumDetails;
      var isMostPopularAlbum;
      var self;

      self = this;
      isMostPopularAlbum = function isMostPopularAlbum (album) {
        return self.albums().every(function isMostPopular (otherAlbum) {
          return album.name !== otherAlbum.name ||
            album.popularity > otherAlbum.items[0];
        });
      };

      /*
      // WORKSHOP_START
       * TODO 2.1: Erstelle die benötigte Datenquelle als Observable-Array
      // WORKSHOP_END
       * - erstelle ein leeres Observable-Array, das an das `albums`-Attribut
       *   dieses ViewModels gebunden ist
       */
      // FINAL_START
      self.albums = ko.observableArray([]);
      // FINAL_END

      addAlbumDetails = function addAlbumDetails (albumId) {
        spotify.fetchAlbumDetails(albumId).then(
          function onAlbum (album) {
            /*
             * Der 'isMostPopularAlbum' Call stellt sicher, dass immer nur das
             * populärste Album im Array auftaucht, *falls* mehrere Alben mit
             * dem gleichen Namen existieren (d.h. beugt Duplikaten vor)
             */
            if (isMostPopularAlbum(album)) {
              /*
              // WORKSHOP_START
               * TODO 2.2: Füge die von der Spotify Web API zurückgegebenen
               *           Album-Details zur Datenquelle hinzu
              // WORKSHOP_END
               * - erstelle ein neues Objekt, das die `id` und `name` Attribute
               *   des `album` enthält
               * - damit die Daten in einem Diagramm angezeigt werden können, wird
               *   außerdem ein `items` Attribut benötigt
               *   - `items` muss ein Array sein, das einen oder mehrere zu
               *     visualisierende Werte erwartet
               *   - in unserem Fall wird nur ein Datum benötigt, nämlich 
               *     die `popularity` des `album` Objekts
               * - füge das erstellte Objekt zum `albums` Array hinzu (z.B. per `push`)
               */
              // FINAL_START
              self.albums.push({
                id: album.id,
                name: album.name,
                items: [album.popularity]
              });
              // FINAL_END
            }
          }
        );
      };

      self.artist = ko.observable().subscribeTo('selectedArtist', true);

      spotify.fetchAlbumsByArtist(self.artist().id).then(
        function onAlbums (response) {
          response.items.forEach(function (albumSummary) {
            addAlbumDetails(albumSummary.id);
          });
        }
      );

      /*
      // WORKSHOP_START
       * TODO 2.4: Um die Klicks des Users auf die Balken im Diagramm zu tracken, erstelle ein weiteres Observable-Array 
      // WORKSHOP_END
       * - erstelle das `selectedAlbums` Observable-Array
       * - veröffentliche die Daten dieses Arrays per knockout-postbox unter dem Key 'selectedAlbums'
       * - wenn der User ein Element im Diagramm anklickt, soll ein Click-Handler
       *   aufgerufen werden der die Navigation zur 'album' View ausführt
       *   - Hinweis: Es gibt keinen Klick-Handler im klassischen Sinn für Diagramme (da auch Multi-Selektion möglich ist)        
       *   - die gewünschte Funktionalität ist mithilfe von Knockouts `subscribe` Funktion lösbar
       */
      // FINAL_START
      self.selectedAlbums = ko.observableArray([]).publishOn('selectedAlbums');
      self.selectedAlbums.subscribe(function () {
        oj.Router.rootInstance.go('album');
      });
      // FINAL_END
    }

    return ArtistViewModel;
  });

(ns karma-golf.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page :only [include-css include-js  html5]]))

(def google-analytics-snippet " <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44486603-1', 'karma-golf.herokuapp.com');
  ga('send', 'pageview');

</script> "
  )

(defpartial layout [& content]
  [:html
   [:head
    [:title "K A R M A   G A R D E N"]

    
    (include-css "/css/reset.css")
    (include-css "/css/bootstrap.css")
    (include-css "/css/main.css")
    (include-js "/js/underscore-min.js")
    (include-js "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js")
    (include-js "/js/piece.js")
    (include-js "/js/key.js")
    (include-js "/js/set.js")
    (include-js "/js/main.js")
    ]
   [:body
    [:div#content.row
     content]]])

(defpartial layout-3D [& content]
  [:html
   [:head
    [:title "K A R M A   G A R D E N"]
    (include-css "/css/reset.css")
    (include-css "/css/bootstrap.css")
    (include-css "/css/main.css")
        google-analytics-snippet
    (include-js "/js/underscore-min.js")
    (include-js "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js")
    (include-js "/js/three.min.js")
    (include-js "/js/gentilis_font/gentilis_regular.typeface.js")
   
    (include-js "/js/cursor.js")
    (include-js "/js/piece.js")
    (include-js "/js/pieces.js")
    (include-js "/js/karmagarden.js")]
   [:body
    [:div#content.row
     content]]
   ]
  )


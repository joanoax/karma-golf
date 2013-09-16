(ns karma-golf.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page :only [include-css include-js  html5]]))



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
    (include-js "/js/underscore-min.js")
    (include-js "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js")
    (include-js "//cdnjs.cloudflare.com/ajax/libs/three.js/r58/three.min.js")
    (include-js "/js/cat.js")
    (include-js "/js/karmagarden.js")
    ]
   [:body
    [:div#content.row
     content]]
   ]
  )


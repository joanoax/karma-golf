(ns karma-golf.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page :only [include-css html5]]))

(defpartial layout [& content]
            (html5
              [:head
               [:title "server"]
               (include-css "/css/reset.css")
               (include-css "/css/main.css")
               ]
              [:body
               [:div#content
                content]]))

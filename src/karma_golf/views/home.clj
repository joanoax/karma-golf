
(ns karma-golf.views.home
  (:require [karma-golf.views.common :as common]
            [karma-golf.models.utils :as utils]
            [karma-golf.models.db :as db]
            [karma-golf.models.game :as game]
            [monger.core :as mg]
            [noir.core :as noir]
            [noir.session :as session]
            [clojure.data.json :as json]
            )
  )

(def lorem "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.	
	paragraphs
	words
	bytes
	lists
Start with 'Lorem
ipsum dolor sit amet...'

")

(def grid-size [15 8])


(def games (atom {}) )

(noir/defpage "/" []
  (session/put! :user-id (str (java.util.UUID/randomUUID)))
  (session/put! :game (ref
                           (game/build-game (keys game/subreds))
                           ))
  
  (common/layout-3D
   [:div#uuid.hidden (session/get :user-id)]
   [:div#container ""]

     [:div#title
      [:h1 "karmagarden"]
      [:div.score-box "stems:"]
      [:ul#stems
       ]
      [:div.up
       [:div#points.score-box]
       [:div.score-box "Score: " [:span#score "0"]]]
      ]
     [:div#convo-bubble
      [:div.contents
       "Place the comment-flowers near the subreddit they came from!"]]
     )
  
  )


(noir/defpage "/flower/:subreddit/:reqId" {subreddit :subreddit
                                           req-id :reqId
                                           }
  (dosync
   (let [game (session/get :game)
         [flower new-game] (game/get-flower (deref game) subreddit)]
     (ref-set game new-game)
     (json/write-str flower)
     )))

(noir/defpage "/stem/:subreddit/:reqId" {subreddit :subreddit
                                            req-id :reqId
                                         }
  (dosync
   (let [game (session/get :game)
         [stem new-game] (game/get-stem (deref game) subreddit)
         ]
     (ref-set game new-game)
     (json/write-str stem)))
    )

#_(noir/defpage "/kill/:subreddit/:title" {subreddit :subreddit
                                         title :title 
                                         }
    (let [game (session/get :game)
          new-game (game/kill-stem game subreddit title)]
    (session/put! :game new-game)
    (json/write-str stem)
    )
    )

(noir/defpage "/piece/" {:keys [id]}
  (let [ game (session/get :game)
        thread-key (rand-nth (keys (:threads game)))
        [comment new-thread] (game/next-comment (get (:threads game) thread-key))
        new-threads (assoc (:threads game) thread-key new-thread)
        new-game (assoc game :threads new-threads)
        ]
    (session/put! :game new-game)
    (json/write-str (dissoc
                     (assoc comment :type (get game/subreds thread-key)
                            :count (count new-thread)
                            )
                     :replies))
    
    )
  )
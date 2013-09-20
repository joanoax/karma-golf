(ns karma-golf.models.game
  (:require [karma-golf.models.db :as db]
            [criterium.core :as bnch]
            )
  )

(def subreds { "AskReddit" "diamonds"
               "worldnews" "hearts"
               "science" "clubs"
               "gaming" "spades"
               "WTF" "reds"
               })

(defn build-game [subreddits]
  {:score 0
   :threads (zipmap subreddits (repeat []))
   }
  )

(defn next-comment
  "The next comment from the thread, and return the comment and an updated thread vector."
  [thread]
  (let [randthread  (shuffle (:comments thread))
        comment (first randthread)
        kids (:replies comment)
        good-kids (map #(assoc % :parent-body (:body-html comment)) kids)
        new-comms (concat (rest randthread) good-kids)
        new-thread (assoc thread :comments new-comms)
        ]
    [comment new-thread]
    )
  )

(defn get-flower [game subreddit]
  (let [threads (get-in game [:threads subreddit])
        ind (rand-int (count threads))
        [comment new-thread] (next-comment (get threads ind))
        flower  (dissoc
                 (assoc comment :subreddit subreddit
                        :remaining (count (:comments new-thread))
                        :thread-title (:title new-thread)
                        :text (:body-html comment)
                        )
                            :replies)
        new-threads (assoc threads ind new-thread)
        new-game (assoc-in game [:threads subreddit] new-threads)
        ]
    [flower new-game]
    )
  )

(defn get-stem [game subreddit]
  (let [thread (db/get-random-thread subreddit)
        pre-stem (select-keys thread [:ups :downs :title :subreddit])
        stem (dissoc (assoc pre-stem :text (:title pre-stem)) :body-html)
        new-threads (conj (get-in game [:threads subreddit]) thread)
        new-game (assoc-in game [:threads subreddit] new-threads)
        ]
    [stem new-game]
    )
  )

(defn kill-stem [game sub thread-title]
  (assoc-in game [:threads sub]
            (vec (remove #(= (:title %) thread-title)
                         (get-in game [:threads sub])
                         )))
  )

(defn run-game [orig-game]
  (loop [game orig-game x 10]
    (if (> 0 x)
      (recur (second (get-flower game "AskReddit"))
             (- x 2))
      game))
  )





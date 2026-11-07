#include <deque>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;
    // Grille entourée d'une bordure de murs : plus besoin de tester les bords.
    int larg = c + 2;
    vector<char> libre(larg * (r + 2), 0);
    int depart = 0, arrivee = 0;
    for (int i = 0; i < r; i++) {
        string ligne;
        cin >> ligne;
        for (int j = 0; j < c; j++) {
            int cas = (i + 1) * larg + j + 1;
            if (ligne[j] != '#') libre[cas] = 1;
            if (ligne[j] == 'S') depart = cas;
            else if (ligne[j] == 'T') arrivee = cas;
        }
    }

    // État = (case, direction) codé par case * 4 + direction.
    // Directions : 0 haut, 1 droite, 2 bas, 3 gauche.
    int pas[4] = {-larg, 1, larg, -1};
    const int INFINI = 1 << 30;
    int nbEtats = 4 * (int)libre.size();
    vector<int> dist(nbEtats, INFINI);
    vector<char> fait(nbEtats, 0);
    deque<int> file;
    for (int d = 0; d < 4; d++) {
        dist[depart * 4 + d] = 0;  // la première direction est libre
        file.push_back(depart * 4 + d);
    }

    while (!file.empty()) {
        int e = file.front();
        file.pop_front();
        if (fait[e]) continue;  // état déjà traité avec une meilleure distance
        fait[e] = 1;
        int cas = e >> 2, d = e & 3, k = dist[e];
        if (cas == arrivee) {
            cout << k << "\n";  // premier état de l'arrivée retiré : c'est le minimum
            return 0;
        }
        // Avancer tout droit : coût 0, à l'avant de la file.
        int suivante = cas + pas[d];
        if (libre[suivante]) {
            int f = suivante * 4 + d;
            if (k < dist[f]) {
                dist[f] = k;
                file.push_front(f);
            }
        }
        // Tourner d'un quart de tour : coût 1, à l'arrière de la file.
        for (int d2 : {(d + 1) & 3, (d + 3) & 3}) {
            int f = cas * 4 + d2;
            if (k + 1 < dist[f]) {
                dist[f] = k + 1;
                file.push_back(f);
            }
        }
    }

    cout << -1 << "\n";
    return 0;
}

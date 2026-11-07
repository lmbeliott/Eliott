#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Le rectangle de coin (r, c), de taille h x w, est-il dans le puits et vide ?
bool place_libre(const vector<string> &g, int r, int c, int h, int w) {
    if (r + h > (int)g.size()) {
        return false;
    }
    for (int i = r; i < r + h; i++) {
        for (int j = c; j < c + w; j++) {
            if (g[i][j] == '#') {
                return false;
            }
        }
    }
    return true;
}

void poser(vector<string> &g, int r, int c, int h, int w) {
    for (int i = r; i < r + h; i++) {
        for (int j = c; j < c + w; j++) {
            g[i][j] = '#';
        }
    }
}

bool est_pleine(const string &ligne) {
    for (char c : ligne) {
        if (c == '.') {
            return false;
        }
    }
    return true;
}

// Remplace g par la grille sans ses lignes pleines ; renvoie leur nombre.
int supprimer_lignes(vector<string> &g) {
    int largeur = g[0].size();
    vector<string> gardees;
    for (int i = 0; i < (int)g.size(); i++) {
        if (!est_pleine(g[i])) {
            gardees.push_back(g[i]);
        }
    }
    int k = g.size() - gardees.size();
    vector<string> h;
    for (int i = 0; i < k; i++) {
        h.push_back(string(largeur, '.'));   // lignes vides en haut
    }
    for (int i = 0; i < (int)gardees.size(); i++) {
        h.push_back(gardees[i]);
    }
    g = h;
    return k;
}

int main() {
    int hauteur, largeur, q;
    cin >> hauteur >> largeur >> q;
    vector<string> g(hauteur, string(largeur, '.'));

    int total = 0;
    for (int t = 0; t < q; t++) {
        int h, w, c;
        cin >> h >> w >> c;
        c = c - 1;                           // colonnes numérotées à partir de 0
        int r = 0;
        while (place_libre(g, r + 1, c, h, w)) {
            r = r + 1;
        }
        poser(g, r, c, h, w);
        total = total + supprimer_lignes(g);
    }

    cout << total << "\n";
    for (int i = 0; i < hauteur; i++) {
        cout << g[i] << "\n";
    }
    return 0;
}

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <utility>
using namespace std;

pair<int, int> case_suivante(const vector<string>& grille, int i, int j) {
    // la case vers laquelle pointe la flèche de (i, j) ; on ressort de l'autre côté aux bords
    int r = grille.size();
    int c = grille[0].size();
    char f = grille[i][j];
    if (f == '^') {
        i = i - 1;
    } else if (f == 'v') {
        i = i + 1;
    } else if (f == '<') {
        j = j - 1;
    } else {
        j = j + 1;
    }
    return {(i % r + r) % r, (j % c + c) % c};
}

int main() {
    int r, c;
    long long k;
    cin >> r >> c >> k;
    vector<string> grille(r);
    for (int i = 0; i < r; i++) {
        cin >> grille[i];
    }

    vector<pair<int, int>> chemin;          // chemin[t] = position après t déplacements
    map<pair<int, int>, long long> instant; // case -> premier instant où le robot y est passé
    chemin.push_back({0, 0});
    instant[{0, 0}] = 0;
    bool boucle = false;
    pair<int, int> retour;
    while ((long long)chemin.size() <= k) {
        pair<int, int> p = chemin.back();
        pair<int, int> suivante = case_suivante(grille, p.first, p.second);
        if (instant.count(suivante) > 0) {
            boucle = true;                  // le robot repasse par une case connue
            retour = suivante;
            break;
        }
        instant[suivante] = chemin.size();
        chemin.push_back(suivante);
    }

    pair<int, int> fin;
    long long distinctes;
    if (!boucle) {
        fin = chemin[k];
        distinctes = k + 1;
    } else {
        long long debut = instant[retour];              // premier instant du cycle
        long long longueur = chemin.size() - debut;     // nombre de cases du cycle
        fin = chemin[debut + (k - debut) % longueur];
        distinctes = chemin.size();
    }
    cout << fin.first + 1 << " " << fin.second + 1 << "\n";
    cout << distinctes << "\n";
    return 0;
}

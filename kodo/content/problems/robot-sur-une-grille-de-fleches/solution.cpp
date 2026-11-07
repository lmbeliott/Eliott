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
    pair<int, int> suivante = case_suivante(grille, 0, 0);
    // on avance tant que l'instant K n'est pas atteint et que la case suivante est nouvelle
    while ((long long)chemin.size() <= k && instant.count(suivante) == 0) {
        instant[suivante] = chemin.size();
        chemin.push_back(suivante);
        suivante = case_suivante(grille, suivante.first, suivante.second);
    }

    pair<int, int> fin;
    long long distinctes;
    if ((long long)chemin.size() > k) {
        // K déplacements simulés sans jamais repasser par une case
        fin = chemin[k];
        distinctes = k + 1;
    } else {
        // la case suivante est déjà connue : le robot tourne en rond
        long long debut = instant[suivante];            // premier instant du cycle
        long long longueur = chemin.size() - debut;     // nombre de cases du cycle
        fin = chemin[debut + (k - debut) % longueur];
        distinctes = chemin.size();
    }
    cout << fin.first + 1 << " " << fin.second + 1 << "\n";
    cout << distinctes << "\n";
    return 0;
}

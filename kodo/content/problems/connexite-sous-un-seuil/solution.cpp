#include <algorithm>
#include <array>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouve(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {  // compression : tout le chemin pointe vers la racine
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

void unit(int a, int b) {
    a = trouve(a);
    b = trouve(b);
    if (a == b) return;
    if (taille[a] < taille[b]) swap(a, b);
    parent[b] = a;  // le petit groupe rejoint le grand
    taille[a] += taille[b];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<array<int, 3>> aretes(m);  // (H, A, B)
    for (auto& s : aretes) cin >> s[1] >> s[2] >> s[0];
    sort(aretes.begin(), aretes.end());
    vector<array<int, 3>> questions(q);  // (X, Y, S)
    for (auto& qu : questions) cin >> qu[0] >> qu[1] >> qu[2];

    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    // On traite les questions par seuil S croissant.
    vector<int> ordre(q);
    iota(ordre.begin(), ordre.end(), 0);
    stable_sort(ordre.begin(), ordre.end(), [&](int i, int j) { return questions[i][2] < questions[j][2]; });

    vector<string> reponses(q);
    int k = 0;  // nombre d'arêtes déjà ajoutées
    for (int j : ordre) {
        int s = questions[j][2];
        while (k < m && aretes[k][0] <= s) {
            unit(aretes[k][1], aretes[k][2]);
            k++;
        }
        reponses[j] = (trouve(questions[j][0]) == trouve(questions[j][1])) ? "OUI" : "NON";
    }

    for (const string& r : reponses) cout << r << "\n";
    return 0;
}

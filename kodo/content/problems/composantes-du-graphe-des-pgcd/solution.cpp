#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    // on abaisse le seuil de N à 1 : au seuil d, on relie d à chacun de ses multiples
    int composantes = n;
    vector<int> reponse(n + 1);  // reponse[t] : nombre de composantes pour le seuil t
    for (int d = n; d >= 1; d--) {
        for (int multiple = 2 * d; multiple <= n; multiple += d) {
            int a = trouver(d), b = trouver(multiple);
            if (a != b) {
                if (taille[a] < taille[b]) swap(a, b);
                parent[b] = a;
                taille[a] += taille[b];
                composantes--;
            }
        }
        reponse[d] = composantes;
    }

    for (int i = 0; i < q; i++) {
        int t;
        cin >> t;
        cout << reponse[t] << (i + 1 == q ? "\n" : " ");
    }
    return 0;
}

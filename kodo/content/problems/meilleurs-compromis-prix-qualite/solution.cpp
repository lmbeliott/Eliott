#include <algorithm>
#include <iostream>
#include <string>
#include <tuple>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    // (prix, -note, nom) : prix croissant, note décroissante, nom
    vector<tuple<int, int, string>> produits(n);
    for (int i = 0; i < n; i++) {
        string nom;
        int q, p;
        cin >> nom >> q >> p;
        produits[i] = make_tuple(p, -q, nom);
    }
    sort(produits.begin(), produits.end());

    vector<string> gardes;
    int meilleure = -1;   // meilleure note parmi les produits déjà traités
    int i = 0;
    while (i < n) {
        int p = get<0>(produits[i]);
        int moins_q = get<1>(produits[i]);
        // groupe des produits identiques (même prix, même note) : indices i à j-1
        int j = i;
        while (j < n && get<0>(produits[j]) == p && get<1>(produits[j]) == moins_q) {
            j++;
        }
        if (-moins_q > meilleure) {
            for (int k = i; k < j; k++) {
                gardes.push_back(get<2>(produits[k]));
            }
            meilleure = -moins_q;
        }
        i = j;
    }
    cout << gardes.size() << "\n";
    for (const string& nom : gardes) {
        cout << nom << "\n";
    }
    return 0;
}

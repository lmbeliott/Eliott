#include <iostream>
#include <vector>
#include <map>
using namespace std;

int main() {
    int n;
    cin >> n;

    // compte[v] = nombre d'apparitions de la valeur v (une map garde ses clés triées).
    map<int, int> compte;
    for (int i = 0; i < n; i++) {
        int v;
        cin >> v;
        compte[v]++;
    }

    // On garde les valeurs vues au moins deux fois, de la plus petite à la plus grande.
    vector<int> doubles;
    for (auto& p : compte) {
        if (p.second >= 2) {
            doubles.push_back(p.first);
        }
    }

    cout << doubles.size() << "\n";
    for (int v : doubles) {
        cout << v << " " << compte[v] << "\n";
    }
    return 0;
}

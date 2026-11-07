#include <iostream>
#include <vector>
#include <map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // Pour chaque valeur (rangées dans l'ordre croissant par la map) : ses positions.
    map<int, vector<int>> positions;
    for (int i = 0; i < n; i++) positions[a[i]].push_back(i);

    // Les éléments jamais déplacés restent devant, dans leur ordre : ce sont toutes les copies
    // des plus petites valeurs, puis éventuellement une partie des copies de la valeur suivante.
    int gardes = 0;
    int fin = -1;   // dernière position des éléments gardés jusqu'ici
    for (auto& [v, pos] : positions) {
        if (pos.front() > fin) {
            // toutes les copies de v sont après les éléments gardés : on les garde toutes
            gardes += pos.size();
            fin = pos.back();
        } else {
            // seules les copies de v placées après les éléments gardés peuvent rester
            for (int p : pos) {
                if (p > fin) gardes++;
            }
            break;
        }
    }

    cout << n - gardes << "\n";
    return 0;
}

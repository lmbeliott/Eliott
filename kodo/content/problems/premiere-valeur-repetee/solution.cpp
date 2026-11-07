#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> valeurs(n);
    for (int i = 0; i < n; i++) {
        cin >> valeurs[i];
    }
    unordered_set<int> vues;
    int i = 0;
    // on avance tant que la valeur lue n'a jamais été vue
    while (i < n && vues.count(valeurs[i]) == 0) {
        vues.insert(valeurs[i]);
        i = i + 1;
    }
    if (i < n) {
        cout << valeurs[i] << " " << i + 1 << "\n";   // position comptée à partir de 1
    } else {
        cout << "AUCUNE\n";
    }
    return 0;
}

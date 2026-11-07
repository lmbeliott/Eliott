#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    // une liste par longueur possible (1 à 12), remplie dans l'ordre de lecture
    vector<vector<string>> paquets(13);
    for (int i = 0; i < n; i++) {
        string m;
        cin >> m;
        paquets[m.size()].push_back(m);
    }
    bool premier = true;
    for (int longueur = 1; longueur <= 12; longueur++) {
        for (const string& m : paquets[longueur]) {
            if (!premier) cout << " ";
            cout << m;
            premier = false;
        }
    }
    cout << "\n";
    return 0;
}

#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    string meilleur;
    cin >> meilleur;
    for (int i = 1; i < n; i++) {
        string m;
        cin >> m;
        if (m.size() > meilleur.size()) {   // > strict : on garde le premier en cas d'égalité
            meilleur = m;
        }
    }
    cout << meilleur << " " << meilleur.size() << "\n";
    return 0;
}
